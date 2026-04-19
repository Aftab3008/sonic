import { Module } from '@nestjs/common';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
import { ConsumerDiscoveryController } from './consumer/consumer-discovery.controller';
import { ConsumerDiscoveryService } from './consumer/consumer-discovery.service';

@Module({
  imports: [AlbumModule, TrackModule],
  controllers: [ConsumerDiscoveryController],
  providers: [ConsumerDiscoveryService],
  exports: [ConsumerDiscoveryService],
})
export class DiscoveryModule {}
